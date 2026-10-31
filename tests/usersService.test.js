const usersService = require('../services/usersService');
const users = require('../data/users');

describe('usersService', () => {
  beforeEach(() => {
    users.splice(0, users.length, { id: 1, name: 'Alex' }, { id: 2, name: 'John' });
  });

  test('Should return all users', () => {
    const result = usersService.getAllUsers();

    expect(result).toEqual([
      { id: 1, name: 'Alex' },
      { id: 2, name: 'John' },
    ]);
  });

  test('Create new user', () => {
    const result = usersService.createUser('Mike');

    expect(result).toEqual({
      name: 'Mike',
      id: 3,
    });

    expect(users).toHaveLength(3);
    expect(users[2]).toEqual({
      name: 'Mike',
      id: 3,
    });
  });

  test('should trim user name', () => {
    const result = usersService.createUser('  Mike  ');

    expect(result.name).toBe('Mike');
  });

  test('should retur user by id', () => {
    const result = usersService.getUserById(1);

    expect(result).toEqual({ id: 1, name: 'Alex' });
  });

  test('should return undefined if user not found', () => {
    const result = usersService.getUserById(9999);

    expect(result).toBeUndefined();
  });

  test('should update user name', () => {
    const result = usersService.updateUser(1, 'Mike');

    expect(result).toEqual({
      id: 1,
      name: 'Mike',
    });

    expect(users[0]).toEqual({
      id: 1,
      name: 'Mike',
    });
  });
  
  test('should return undefined if user not found', () => {
    const result = usersService.updateUser(999, 'Mike');

    expect(result).toBeUndefined();
  })

  test('should delete user', () => {
    const result = usersService.deleteUser(1);

    expect(result).toBe(true);
    expect(users).toHaveLength(1);
    expect(users.find(item => item.id === 1)).toBeUndefined()
  })

  test('should return false if user not found', () => {
    const result = usersService.deleteUser(999);
    expect(result).toBe(false)
  })
});
