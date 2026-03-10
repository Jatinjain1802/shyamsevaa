/**
 * Upload media to Meta Resumable Upload API and return header handle.
 * Required for IMAGE/VIDEO/DOCUMENT template header examples.
 */
export const uploadToMeta = async (file) => {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
  const appId = process.env.WHATSAPP_APP_ID || process.env.META_APP_ID;
  const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || process.env.META_VERSION || "v22.0";

  if (!accessToken || !appId) {
    throw new Error(
      "Meta upload credentials missing: WHATSAPP_ACCESS_TOKEN and WHATSAPP_APP_ID (or META_*) are required."
    );
  }

  if (!file?.buffer || !file?.size || !file?.mimetype) {
    throw new Error("Valid media file is required for Meta upload.");
  }

  const sessionUrl =
    `https://graph.facebook.com/${graphVersion}/${appId}/uploads` +
    `?file_length=${file.size}` +
    `&file_type=${encodeURIComponent(file.mimetype)}` +
    `&access_token=${encodeURIComponent(accessToken)}`;

  const sessionResponse = await fetch(sessionUrl, { method: "POST" });
  const sessionData = await sessionResponse.json();

  if (!sessionResponse.ok || !sessionData?.id) {
    const message = sessionData?.error?.message || "Failed to start Meta upload session.";
    throw new Error(message);
  }

  const uploadUrl = `https://graph.facebook.com/${graphVersion}/${sessionData.id}`;
  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${accessToken}`,
      file_offset: "0",
    },
    body: file.buffer,
  });

  const uploadData = await uploadResponse.json();
  if (!uploadResponse.ok || !uploadData?.h) {
    const message = uploadData?.error?.message || "Failed to upload media file to Meta.";
    throw new Error(message);
  }

  return uploadData.h;
};
