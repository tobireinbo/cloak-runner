export type ObservableAction<T> = (data: T) => void;
export type ObservableSetter<T> = T | ((prevData: T) => T);
