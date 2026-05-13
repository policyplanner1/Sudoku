import axios from 'axios';

// Android Emulator
const BASE_URL = 'https://rewardplanners.com/api/crm/v1/sudoku';


export const startSudokuGame = async (
  difficulty = 'easy',
) => {
  const response = await axios.post(
    `${BASE_URL}/start`,
    {
      difficulty,
    },
  );

  return response.data;
};

export const completeSudokuGame = async payload => {
  const response = await axios.post(
    `${BASE_URL}/complete`,
    payload,
  );

  return response.data;
};