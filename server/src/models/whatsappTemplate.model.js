import db from "../config/db.js";
import { extractVariableNumbers } from "../utils/whatsapp.service.js";

const parseJson = (value, fallback = null) => {
  if (!value) return fallback;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const extractBodyText = (structure) => {
  const list = Array.isArray(structure) ? structure : parseJson(structure, []);
  if (!Array.isArray(list)) return "";

  const body = list.find((c) => String(c?.type || "").toUpperCase() === "BODY");
  return String(body?.text || "");
};

const hydrateTemplateRow = (row) => {
  const structure = parseJson(row.structure_json, []);
  const bodyText = extractBodyText(structure);
  const variableNumbers = extractVariableNumbers(bodyText);

  return {
    ...row,
    structure_json: structure,
    mapped_use_cases: row.mapped_use_cases
      ? String(row.mapped_use_cases)
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      : [],
    body_text: bodyText,
    variable_numbers: variableNumbers,
  };
};

export const createWhatsappTemplateRecord = async ({
  name,
  category,
  language,
  structure,
  status = "local_pending",
  metaTemplateId = null,
  metaStatus = null,
  rejectionReason = null,
  sampleMediaUrl = null,
  isActive = true,
  createdBy = null,
}) => {
  const [result] = await db.query(
    `
      INSERT INTO whatsapp_templates
      (
        name,
        category,
        language,
        structure_json,
        status,
        meta_template_id,
        meta_status,
        rejection_reason,
        sample_media_url,
        is_active,
        created_by,
        last_synced_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      name,
      category,
      language,
      JSON.stringify(structure || []),
      status,
      metaTemplateId,
      metaStatus,
      rejectionReason,
      sampleMediaUrl,
      isActive ? 1 : 0,
      createdBy,
      metaStatus ? new Date() : null,
    ]
  );

  return result.insertId;
};

export const updateWhatsappTemplateMeta = async ({
  id,
  status,
  metaStatus = null,
  metaTemplateId = null,
  rejectionReason = null,
}) => {
  const [result] = await db.query(
    `
      UPDATE whatsapp_templates
      SET
        status = ?,
        meta_status = COALESCE(?, meta_status),
        meta_template_id = COALESCE(?, meta_template_id),
        rejection_reason = ?,
        last_synced_at = NOW(),
        updated_at = NOW()
      WHERE id = ?
    `,
    [status, metaStatus, metaTemplateId, rejectionReason, id]
  );

  return result.affectedRows > 0;
};

export const findWhatsappTemplateByNameLanguage = async (name, language) => {
  const [rows] = await db.query(
    `
      SELECT *
      FROM whatsapp_templates
      WHERE name = ? AND language = ?
      LIMIT 1
    `,
    [name, language]
  );

  return rows[0] ? hydrateTemplateRow(rows[0]) : null;
};

export const findWhatsappTemplateById = async (id) => {
  const [rows] = await db.query(
    `
      SELECT wt.*,
             GROUP_CONCAT(wtu.use_case ORDER BY wtu.use_case SEPARATOR ',') AS mapped_use_cases
      FROM whatsapp_templates wt
      LEFT JOIN whatsapp_template_usecases wtu ON wtu.template_id = wt.id
      WHERE wt.id = ?
      GROUP BY wt.id
      LIMIT 1
    `,
    [id]
  );

  return rows[0] ? hydrateTemplateRow(rows[0]) : null;
};

export const listWhatsappTemplateRecords = async ({
  category = null,
  status = null,
  search = null,
  limit = 100,
  offset = 0,
} = {}) => {
  const where = [];
  const params = [];

  if (category) {
    where.push("wt.category = ?");
    params.push(category);
  }

  if (status) {
    where.push("wt.status = ?");
    params.push(status);
  }

  if (search) {
    where.push("(wt.name LIKE ? OR wt.category LIKE ? OR wt.language LIKE ?)");
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows] = await db.query(
    `
      SELECT
        wt.*,
        GROUP_CONCAT(wtu.use_case ORDER BY wtu.use_case SEPARATOR ',') AS mapped_use_cases
      FROM whatsapp_templates wt
      LEFT JOIN whatsapp_template_usecases wtu ON wtu.template_id = wt.id
      ${whereClause}
      GROUP BY wt.id
      ORDER BY wt.created_at DESC
      LIMIT ? OFFSET ?
    `,
    [...params, Number(limit), Number(offset)]
  );

  return rows.map(hydrateTemplateRow);
};

export const upsertWhatsappTemplateFromMeta = async ({
  name,
  category,
  language,
  structure,
  status,
  metaStatus,
  metaTemplateId,
  rejectionReason = null,
}) => {
  const [result] = await db.query(
    `
      INSERT INTO whatsapp_templates
      (
        name,
        category,
        language,
        structure_json,
        status,
        meta_template_id,
        meta_status,
        rejection_reason,
        is_active,
        last_synced_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())
      ON DUPLICATE KEY UPDATE
        category = VALUES(category),
        structure_json = VALUES(structure_json),
        status = VALUES(status),
        meta_template_id = VALUES(meta_template_id),
        meta_status = VALUES(meta_status),
        rejection_reason = VALUES(rejection_reason),
        last_synced_at = NOW(),
        updated_at = NOW()
    `,
    [
      name,
      category,
      language,
      JSON.stringify(structure || []),
      status,
      metaTemplateId,
      metaStatus,
      rejectionReason,
    ]
  );

  return result.insertId || null;
};

export const toggleWhatsappTemplateActive = async ({ id, isActive }) => {
  const [result] = await db.query(
    `
      UPDATE whatsapp_templates
      SET is_active = ?, updated_at = NOW()
      WHERE id = ?
    `,
    [isActive ? 1 : 0, id]
  );

  return result.affectedRows > 0;
};

export const deleteWhatsappTemplateRecord = async (id) => {
  const [result] = await db.query(
    `
      DELETE FROM whatsapp_templates
      WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};

const hydrateUseCaseRow = (row) => ({
  ...row,
  variable_mapping: parseJson(row.variable_mapping, {}),
});

export const upsertWhatsappUseCaseMapping = async ({
  useCase,
  templateId,
  variableMapping,
  updatedBy = null,
}) => {
  await db.query(
    `
      INSERT INTO whatsapp_template_usecases
      (use_case, template_id, variable_mapping, updated_by)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        template_id = VALUES(template_id),
        variable_mapping = VALUES(variable_mapping),
        updated_by = VALUES(updated_by),
        updated_at = CURRENT_TIMESTAMP
    `,
    [useCase, templateId, JSON.stringify(variableMapping || {}), updatedBy]
  );
};

export const getWhatsappUseCaseMappings = async () => {
  const [rows] = await db.query(
    `
      SELECT
        wtu.*,
        wt.name AS template_name,
        wt.language AS template_language,
        wt.category AS template_category,
        wt.meta_status AS template_meta_status,
        wt.status AS template_status,
        wt.is_active AS template_is_active,
        wt.structure_json
      FROM whatsapp_template_usecases wtu
      LEFT JOIN whatsapp_templates wt ON wt.id = wtu.template_id
      ORDER BY wtu.use_case ASC
    `
  );

  return rows.map(hydrateUseCaseRow);
};

export const getWhatsappUseCaseMappingByUseCase = async (useCase) => {
  const [rows] = await db.query(
    `
      SELECT
        wtu.*,
        wt.name AS template_name,
        wt.language AS template_language,
        wt.category AS template_category,
        wt.meta_status AS template_meta_status,
        wt.status AS template_status,
        wt.is_active AS template_is_active,
        wt.structure_json
      FROM whatsapp_template_usecases wtu
      LEFT JOIN whatsapp_templates wt ON wt.id = wtu.template_id
      WHERE wtu.use_case = ?
      LIMIT 1
    `,
    [useCase]
  );

  return rows[0] ? hydrateUseCaseRow(rows[0]) : null;
};

