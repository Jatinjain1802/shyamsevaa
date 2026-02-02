
import fs from 'fs';
import path from 'path';

const othersPath = path.join('uploads', 'others');
const poojasPath = path.join('uploads', 'poojas');

if (fs.existsSync(othersPath)) {
    const files = fs.readdirSync(othersPath);
    files.forEach(file => {
        // Simple heuristic: if it looks like a timestamped file created recently (starts with 177...), move it.
        // Actually, just move the ones we know are broken or all of them?
        // Let's move all files that look like our uploads (timestamp-random.ext)
        // because "others" shouldn't have many valid files if we mapped most things.
        // But to be safe, I'll match the IDs I saw earlier or simply move all of them since I just created this mess.

        // Wait, 'others' might have stuff from other fields if I missed any.
        // But specifically for 'gallery' which was defaulting to 'others', these are likely gallery images.
        // I will optimistically move them.

        const oldPath = path.join(othersPath, file);
        const newPath = path.join(poojasPath, file);
        try {
            fs.renameSync(oldPath, newPath);
            console.log(`Moved ${file}`);
        } catch (err) {
            console.error(`Failed to move ${file}:`, err);
        }
    });
}
