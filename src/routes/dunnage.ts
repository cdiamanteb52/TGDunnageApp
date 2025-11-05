import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

const router = Router();

// GET /api/dunnage - List all dunnage with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { team, cell, search } = req.query;

    // Build where clause based on query params
    const where: Prisma.DunnageWhereInput = {};
    const andConditions: Prisma.DunnageWhereInput[] = [];

    if (team && typeof team === 'string') {
      andConditions.push({ team });
    }

    if (cell && typeof cell === 'string') {
      andConditions.push({ cell });
    }

    if (search && typeof search === 'string') {
      andConditions.push({
        OR: [
          { team: { contains: search, mode: 'insensitive' } },
          { cell: { contains: search, mode: 'insensitive' } },
          { partNumber: { contains: search, mode: 'insensitive' } },
          { primaryDunnage: { contains: search, mode: 'insensitive' } },
          { backupDunnage: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const dunnageItems = await prisma.dunnage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: dunnageItems,
      count: dunnageItems.length,
    });
  } catch (error) {
    console.error('Error fetching dunnage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dunnage items',
    });
  }
});

// GET /api/dunnage/:id - Get a single dunnage item by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dunnageId = parseInt(id, 10);

    if (isNaN(dunnageId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
      });
    }

    const dunnageItem = await prisma.dunnage.findUnique({
      where: { id: dunnageId },
    });

    if (!dunnageItem) {
      return res.status(404).json({
        success: false,
        error: 'Dunnage item not found',
      });
    }

    res.json({
      success: true,
      data: dunnageItem,
    });
  } catch (error) {
    console.error('Error fetching dunnage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dunnage item',
    });
  }
});

// POST /api/dunnage - Create a new dunnage item
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      team,
      cell,
      partNumber,
      primaryDunnage,
      backupDunnage,
      phStd,
      phBreak,
      phLunch,
      pkPiecesKanban,
    } = req.body;

    // Basic validation
    if (!team || typeof team !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Team is required and must be a string',
      });
    }

    if (!cell || typeof cell !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Cell is required and must be a string',
      });
    }

    if (!partNumber || typeof partNumber !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Part number is required and must be a string',
      });
    }

    if (!primaryDunnage || typeof primaryDunnage !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Primary dunnage is required and must be a string',
      });
    }

    // Validate numeric fields if provided
    if (phStd !== undefined && phStd !== null && typeof phStd !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'phStd must be a number if provided',
      });
    }

    if (phBreak !== undefined && phBreak !== null && typeof phBreak !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'phBreak must be a number if provided',
      });
    }

    if (phLunch !== undefined && phLunch !== null && typeof phLunch !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'phLunch must be a number if provided',
      });
    }

    if (pkPiecesKanban !== undefined && pkPiecesKanban !== null && typeof pkPiecesKanban !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'pkPiecesKanban must be a number if provided',
      });
    }

    const newDunnage = await prisma.dunnage.create({
      data: {
        team,
        cell,
        partNumber,
        primaryDunnage,
        backupDunnage,
        phStd,
        phBreak,
        phLunch,
        pkPiecesKanban,
      },
    });

    res.status(201).json({
      success: true,
      data: newDunnage,
    });
  } catch (error) {
    console.error('Error creating dunnage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create dunnage item',
    });
  }
});

export default router;
