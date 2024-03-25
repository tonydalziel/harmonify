import { tasks } from "./stores";

export const round = (value: number, precision: number = 2): number => {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
};

export const completeTask = (task: string) => {
    tasks.update((tasks) => {
        if (tasks[task]) {
            tasks[task][1] = true;
        }
        return tasks;
    });
}