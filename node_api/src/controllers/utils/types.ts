export type PointVetorType = {
  id: string | number;
  vector:
    | number[]
    | {
        [key: string]:
          | number[]
          | {
              indices: number[];
              values: number[];
            }
          | undefined;
      };
  payload?:
    | Record<string, unknown>
    | {
        [key: string]: unknown;
      }
    | null
    | undefined;
};
