export type Pattern<T> = {
  data: T;
  condition: boolean;
  action: () => void;
};
