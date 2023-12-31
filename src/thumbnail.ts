import fs from 'fs';
import htmlToImage from 'node-html-to-image';

const template = fs.readFileSync('./templates/thumbnail.html').toString();

export async function create_thumbnail(text: string, slug: string) {
  const html = template.replace('{{text}}', text);
  await htmlToImage({
    output: './projects/slug/thumbnail.png',
    html,
  });
}
