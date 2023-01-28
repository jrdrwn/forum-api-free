const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHash = require('../../security/PasswordHash');
const LoginUserUseCase = require('../LoginUserUseCase');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const expectedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    // Mocking
    jest.spyOn(mockUserRepository, 'getPasswordByUsername').mockResolvedValue('encrypted_password');
    jest.spyOn(mockPasswordHash, 'comparePassword').mockResolvedValue();
    jest
      .spyOn(mockAuthenticationTokenManager, 'createAccessToken')
      .mockResolvedValue(expectedAuthentication.accessToken);
    jest
      .spyOn(mockAuthenticationTokenManager, 'createRefreshToken')
      .mockResolvedValue(expectedAuthentication.refreshToken);
    jest.spyOn(mockUserRepository, 'getIdByUsername').mockResolvedValue('user-123');
    jest.spyOn(mockAuthenticationRepository, 'addToken').mockResolvedValue();
    jest.spyOn(mockAuthenticationRepository, 'checkAvailabilityToken').mockResolvedValue();
    jest.spyOn(mockAuthenticationRepository, 'deleteToken').mockResolvedValue();

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(expectedAuthentication);
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('dicoding');
    expect(mockPasswordHash.comparePassword).toBeCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: 'dicoding',
      id: 'user-123',
    });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
      username: 'dicoding',
      id: 'user-123',
    });
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(
      expectedAuthentication.refreshToken
    );
  });
});
