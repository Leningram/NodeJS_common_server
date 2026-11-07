const connectDB = require('../database/database');
const createUsersService = require('../services/usersService');

describe('usersService', () => {
  let db, usersService;

  beforeAll(async () => {
    db = await connectDB(':memory:');
    usersService = createUsersService(db);
  });

  beforeEach(async () => {
    await db.run('DELETE FROM users');
    await db.run('INSERT INTO users (name) VALUES(?)', ['Alex']);
    await db.run('INSERT INTO users (name) VALUES(?)', ['John']);
  });

  afterAll(async () => {
    await db.close();
  });

  test('Should return all users', async () => {
    const result = await usersService.getAllUsers();

    expect(result).toEqual([
      { id: 1, name: 'Alex' },
      { id: 2, name: 'John' },
    ]);
  });

  test('Create new user', async () => {
    const result = await usersService.createUser('Mike');
    const id = result.id;
    expect(result).toEqual({
      name: 'Mike',
      id,
    });

    expect(await usersService.getAllUsers()).toHaveLength(3);
    expect(await usersService.getUserById(id)).toEqual({
      name: 'Mike',
      id,
    });
  });

  test('should trim user name', async () => {
    const result = await usersService.createUser('  Mike  ');

    expect(result.name).toBe('Mike');
  });

  test('should return user by id', async () => {
    const users = await usersService.getAllUsers();
    const alex = users.find((user) => user.name === 'Alex');

    const result = await usersService.getUserById(alex.id);

    expect(result).toEqual(alex);
  });

  test('should return null if user not found', async () => {
    const result = await usersService.getUserById(9999);

    expect(result).toBeUndefined();
  });

  test('should update user name', async () => {
    const users = await usersService.getAllUsers();
    const alex = users.find((user) => user.name === 'Alex');

    const result = await usersService.updateUser(alex.id, 'Mike');

    expect(result).toEqual({
      id: alex.id,
      name: 'Mike',
    });

    expect(await usersService.getUserById(alex.id)).toEqual({
      id: alex.id,
      name: 'Mike',
    });
  });

  test('should return undefined if user not found', async () => {
    const result = await usersService.updateUser(999, 'Mike');

    expect(result).toBeUndefined();
  });

  test('should delete user', async () => {
    const users = await usersService.getAllUsers();
    const alex = users.find((user) => user.name === 'Alex');

    const result = await usersService.deleteUser(alex.id);
    expect(result).toBe(true);
    const updatedUsers = await usersService.getAllUsers();
    expect(updatedUsers).toHaveLength(1);
    expect(updatedUsers.find((item) => item.id === 1)).toBeUndefined();
  });

  test('should return false if user not found', async () => {
    const result = await usersService.deleteUser(999);
    expect(result).toBe(false);
  });
});
