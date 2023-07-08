const { Octokit } = require('@octokit/rest');
const sodium = require('libsodium-wrappers');

var key1, key_id1, output;

async function getRepoPublicKey() {
  const octokit = new Octokit({
    auth: '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',
    userAgent: 'MyApp',
    baseUrl: 'https://api.github.com',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  try {
    const response = await octokit.request('GET /repos/SS0809/my-new-repo/actions/secrets/public-key', {
      owner: 'SS0809',
      repo: 'my-new-repo',
    });

    const { key_id, key } = response.data;
    console.log('Key ID:', key_id);
    console.log('Public Key:', key);
    key_id1 = key_id;
    key1 = key;
  } catch (error) {
    console.error('Error retrieving repo public key:', error);
  }
}

async function base64EncodeKey(key) {
  await sodium.ready;

  // Base64 encode the key
  const encodedKey = sodium.to_base64(key);

  return encodedKey;
}

async function encryptSecret(secret, key) {
  await sodium.ready;

  // Convert the key and secret to Uint8Arrays
  const binKey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
  const binSecret = sodium.from_string(secret);

  // Encrypt the secret using LibSodium
  const encryptedBytes = sodium.crypto_box_seal(binSecret, binKey);

  // Convert encrypted Uint8Array to Base64
  const output = sodium.to_base64(encryptedBytes, sodium.base64_variants.ORIGINAL);
  return output;
}

async function createRepositorySecret() {
  await getRepoPublicKey();

  // Usage example
  const secret = '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'; // Replace with the secret you want to encrypt

  // Base64 encode the key
  const encodedKey = await base64EncodeKey(key1);

  // Encrypt the secret
  const encryptedValue = await encryptSecret(secret, encodedKey);

  const octokit = new Octokit({
    auth: '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',
    userAgent: 'MyApp',
    baseUrl: 'https://api.github.com',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  try {
    const response = await octokit.actions.createOrUpdateRepoSecret({
      owner: 'SS0809',
      repo: 'my-new-repo',
      secret_name: 'ACCESS_TOKEN',
      encrypted_value: encryptedValue,
      key_id: key_id1,
    });
    console.log('Repository secret created:', response.data);
  } catch (error) {
    console.error('Failed to create repository secret:', error);
  }
}

// Run the function to create the repository secret
createRepositorySecret();
      
