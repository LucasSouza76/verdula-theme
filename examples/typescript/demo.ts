// Sample file to preview the Verdula theme

/**
 * Represents a user of the system.
 * @param name - full name
 */
interface User {
  id: number;
  name: string;
  active: boolean;
}

enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

const MAX_LIMIT = 100;
const emailPattern = /^[\w.-]+@[\w-]+\.\w{2,}$/;

function log<T>(method: T, context: ClassMethodDecoratorContext): T {
  console.log(`Method ${String(context.name)} decorated\n`);
  return method;
}

export class UserRepository<T extends User> {
  private items: T[] = [];

  constructor(private readonly source: string) {}

  @log
  async load(): Promise<T[]> {
    // TODO: handle network errors
    const response = await fetch(this.source);
    this.items = (await response.json()) as T[];
    return this.items.filter((u) => u.active && u.id < MAX_LIMIT);
  }

  find(id: number): T | undefined {
    return this.items.find((user) => user.id === id);
  }
}

const repo = new UserRepository("/api/users");
repo.load().then((list) => {
  console.log(list.length > 0 ? Status.Active : Status.Inactive, emailPattern.test("a@b.com"));
});
