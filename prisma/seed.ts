import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface DunnageData {
  team: string;
  cell: string;
  partNumber: string;
  primaryDunnage: string;
  backupDunnage?: string;
  phStd?: number;
  phBreak?: number;
  phLunch?: number;
  pkPiecesKanban?: number;
}

function parseValue(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === 'TBD' || trimmed === 'N/A') {
    return null;
  }
  const parsed = parseInt(trimmed, 10);
  return isNaN(parsed) ? null : parsed;
}

async function main() {
  console.log('Starting seed...');

  // Read CSV file
  const csvPath = path.join(__dirname, '..', 'data', 'dunnage.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV (semicolon-separated)
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(';').map(h => h.trim());

  const data: DunnageData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';').map(v => v.trim());
    
    const dunnageItem: DunnageData = {
      team: values[0],
      cell: values[1],
      partNumber: values[2],
      primaryDunnage: values[3],
      backupDunnage: values[4] && values[4] !== '' ? values[4] : undefined,
      phStd: parseValue(values[5]) || undefined,
      phBreak: parseValue(values[6]) || undefined,
      phLunch: parseValue(values[7]) || undefined,
      pkPiecesKanban: parseValue(values[8]) || undefined,
    };

    data.push(dunnageItem);
  }

  console.log(`Parsed ${data.length} dunnage items from CSV`);

  // Insert data into database
  const result = await prisma.dunnage.createMany({
    data: data,
    skipDuplicates: true,
  });

  console.log(`Successfully seeded ${result.count} dunnage items`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
