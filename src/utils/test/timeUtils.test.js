import { wait } from "../timeUtils";

jest.useFakeTimers();

describe("wait", () => {
  const callback = jest.fn();
  const waitTime = 1000;
  test("should wait 1 second before calling the callback", () => {
    wait(callback, waitTime);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(callback, waitTime);
  });
});
