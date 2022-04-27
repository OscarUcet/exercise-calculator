interface ExerciseValues {
  targetHours: number;
  dailyHours: Array<number>;
}

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface Rating {
  rating: number;
  ratingDescription: string;
}

export const checkDailyHours = (daily: Array<string>): boolean => {
  return daily.every(hour => !isNaN(Number(hour)));
};

const parseExerciseArguments = (args: Array<string>): ExerciseValues => {
  if (args.length < 3) throw new Error('Not enough arguments');
  const daily = args.slice(3);
  const allNums = checkDailyHours(daily);

  if (!isNaN(Number(args[2])) && allNums) {
    return {
      targetHours: Number(args[2]),
      dailyHours: daily.map(hours => Number(hours))
    };
  } else {
    throw new Error('Provided values must all be numbers!');
  }
};

const countTrainingDays = (dailyExerciseHours: number[]): number => {
  return dailyExerciseHours.filter(hours => hours !== 0).length;
};

const calculateAverage = (dailyExerciseHours: number[]): number => {
  if (dailyExerciseHours.length === 0) { return 0; }

  const sumHours = dailyExerciseHours.reduce((sum, currHours) => {
    return sum + currHours;
  }, 0);

  return sumHours / dailyExerciseHours.length;
};

const calculateRating = (average: number, target: number): Rating => {
  if (average < (target - 0.5)) {
    return {
      rating: 1,
      ratingDescription: 'try a little harder'
    };
  } else if (average < target) {
    return {
      rating: 2,
      ratingDescription: 'not too bad but could be better'
    };
  } else {
    return {
      rating: 3,
      ratingDescription: 'you\'re doing great!'
    };
  }
};

const calculateExercises = (targetDailyHours: number, dailyExerciseHours: number[]): Result => {
  const average = calculateAverage(dailyExerciseHours);
  const ratingInfo = calculateRating(average, targetDailyHours);

  return {
    periodLength: dailyExerciseHours.length,
    trainingDays: countTrainingDays(dailyExerciseHours),
    success: average >= targetDailyHours,
    rating: ratingInfo.rating,
    ratingDescription: ratingInfo.ratingDescription,
    target: targetDailyHours,
    average: average,
  };
};

try {
  const { targetHours, dailyHours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(targetHours, dailyHours));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export default calculateExercises;