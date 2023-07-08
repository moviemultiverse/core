const { Octokit } = require('@octokit/rest');
const sodium = require('libsodium-wrappers');
const octokit = new Octokit({
  auth: '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'
})

const response= await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
  owner: 'OWNER',
  repo: 'REPO',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

async function base64EncodeKey(key) {
  await sodium.ready;
  const encodedKey = sodium.to_base64(key);
  return encodedKey;
}
const key = Buffer.from(response.key, 'utf8');
const encodedKey = base64EncodeKey(key);
console.log('Encoded key:', encodedKey);

const secret = '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' // replace with the secret you want to encrypt
const key = encodedKey;

//Check if libsodium is ready and then proceed.
sodium.ready.then(() => {
  // Convert Secret & Base64 key to Uint8Array.
  let binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
  let binsec = sodium.from_string(secret)

  //Encrypt the secret using LibSodium
  let encBytes = sodium.crypto_box_seal(binsec, binkey)

  // Convert encrypted Uint8Array to Base64
  let output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)

  console.log(output)
});
