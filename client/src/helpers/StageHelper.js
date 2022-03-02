import React from 'react';
import { TETROMINOES } from './Tetrominoes';
import { TetrominoStyle } from '../components/styles/TetrominoStyle';

export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

export const CreateStage = (map) => {
    return map.map(row => {
        return row.map((cell, key) => {
            return <TetrominoStyle key={key} type={cell} color={TETROMINOES[cell[0]].color} />
        })
    })
}