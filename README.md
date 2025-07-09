# Solution to [Elevator Saga](https://play.elevatorsaga.com/)

This solution is based on the PASS algorithm for elevators. We keep track of an indicator array for elevator requests on each floor, and each elevator performs PASS independently, stopping at these floors.

## Strengths

Generally, this performs well on challenges requiring a maximum number of moves or moving a quota of people in a limited amount of time. This is because PASS is optimized for distance travelled.

## Weaknesses

A weak point is the maximum wait time, and this struggles on challenges 13 and 14 in particular. Since the algorithm does not consider order of requests, this can lead to some starvation. However, due to the nature of PASS, this starvation is never prolonged.
