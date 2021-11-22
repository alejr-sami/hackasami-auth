import { useEffect, useState } from "react";
import useAuthContext from "./useAuth";
import axios from "axios";

const STEPS = 5000;
const POINTS = 10;
const POINTS_PER_STEP = POINTS / STEPS;

const calculatePoints = (steps) => steps * POINTS_PER_STEP;
const useStepHistory = () => {
  const { token } = useAuthContext();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      fetchStepHistory(token);
    }
  }, [token]);

  const fetchStepHistory = (token) => {
    setLoading(true);
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setMonth(startDate.getMonth() - 1);
    const finalDate = new Date();
    finalDate.setDate(finalDate.getDate() + 1);
    finalDate.setHours(0, 0, 0, 0);
    console.log(startDate);
    console.log(finalDate);
    axios
      .post(
        "https://www.googleapis.com/fitness/v1/users/me/dataset/:aggregate",
        {
          aggregateBy: [
            {
              dataTypeName: "com.google.step_count.delta",
              dataSourceId:
                "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: +startDate,
          endTimeMillis: +finalDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const items = response.data.bucket;

        let totalPoints = 0;
        const history = items.map(
          ({ startTimeMillis, endTimeMillis, dataset }) => {
            const initialDate = new Date(+startTimeMillis);
            const finalDate = new Date(+endTimeMillis);

            const steps = dataset[0].point[0]?.value[0]?.intVal || 0;
            const points = calculatePoints(steps);
            const roundedPoints = Math.floor(points);
            totalPoints += points;
            return {
              initialDate,
              finalDate,
              steps,
              points: roundedPoints,
            };
          }
        );

        setTotalPoints(Math.floor(totalPoints));

        setHistory(history.reverse());
      })
      .catch(() => {
        setError("Ocorreu um erro ao obter atividades");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const update = () => {
    fetchStepHistory(token);
  };

  return {
    history,
    totalPoints,
    loading,
    error,
    update,
  };
};
export default useStepHistory;
