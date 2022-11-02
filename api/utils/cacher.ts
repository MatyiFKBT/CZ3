import fjss from "fast-json-stable-stringify";

export async function tryWithEach<T, R>(items: T[], fn: (item: T) => Promise<R>) {
  for (const item of items) {
    try {
      return await fn(item);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  throw new Error("No valid try");
}

const GENERIC_CLANS = [
  2041, // Cup of Dev Clan,
  1349, // Cup of Coffee Clan
  1, // Munzee HQ
  // First 100 clans
  ...new Array(100).fill(0).map((_, i) => i + 2),
];

export async function tryWithEachGenericClan<R>(fn: (clan_id: number) => Promise<R>) {
  return await tryWithEach(GENERIC_CLANS, fn);
}

const GENERIC_USERS = [
  455935, // CuppaZee
  51311, // Thegenie18
  125914, // sohcah
];

export async function tryWithEachGenericUser<R>(fn: (user_id: number) => Promise<R>) {
  return await tryWithEach(GENERIC_USERS, fn);
}

export class Cacher<TData, TInput = string | undefined> {
  private cache: Map<string, [Promise<TData>, number]> = new Map();

  constructor(
    private func: (input: TInput) => TData | Promise<TData>,
    private timeout: number | ((input: TInput) => number)
  ) {}

  async get(...input: TInput extends undefined ? [TInput?] : [TInput]): Promise<TData> {
    const key = fjss(input);
    const cached = this.cache.get(key);
    if (cached && Date.now() > cached[1]) {
      return await cached[0];
    }

    const value = this.func(input[0]!);
    const timeout = this.timeout instanceof Function ? this.timeout(input[0]!) : this.timeout;
    this.cache.set(key, [Promise.resolve(value), Date.now() + timeout]);
    return value;
  }

  clear() {
    this.cache.clear();
  }
}
