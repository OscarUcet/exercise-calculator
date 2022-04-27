import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises, { checkDailyHours } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    res.status(400).json({ error: 'malformatted parameters' });
  } else {
    const bmi = calculateBmi(Number(height), Number(weight));
    res.json({
      weight: Number(weight),
      height: Number(height),
      bmi: bmi
    });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises: dailyExerciseHours, target } = req.body;

  if ( !dailyExerciseHours || !target ) {
    return res.status(400).json({ error: 'parameters missing' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  } else if (!Array.isArray(dailyExerciseHours) || !checkDailyHours(dailyExerciseHours) || isNaN(Number(target))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(Number(target), dailyExerciseHours);
  return res.json(result);
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});