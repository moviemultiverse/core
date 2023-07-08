const { Octokit } = require('@octokit/rest');
var key , key_id , outpu;
async function getRepoPublicKey() {
  const octokit = new Octokit({
    auth: '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'
  });

  try {
    const response = await octokit.request('GET /repos/SS0809/my-new-repo/actions/secrets/public-key', {
      owner: 'SS0809',
      repo: 'my_new_repo',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const { ey_id, ey } = response.data;
    console.log('Key ID:', ey_id);
    console.log('Public Key:', ey);
    key_id=ey_id;
    key=ey;
  } catch (error) {
    console.error('Error retrieving repo public key:', error);
  }
}

getRepoPublicKey();


async function base64EncodeKey(key) {
  await sodium.ready;

  // Base64 encode the key
  const encodedKey = sodium.to_base64(key);

  return encodedKey;
}

// Usage example
const keyy = Buffer.from(key, 'utf8'); // Replace 'my_key' with your actual key
const encodedKey = base64EncodeKey(keyy);
console.log('Encoded key:', encodedKey);


const secret = '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' // replace with the secret you want to encrypt


//Check if libsodium is ready and then proceed.
sodium.ready.then(() => {
  // Convert Secret & Base64 key to Uint8Array.
  let binkey = sodium.from_base64(encodedKey, sodium.base64_variants.ORIGINAL)
  let binsec = sodium.from_string(secret)

  //Encrypt the secret using LibSodium
  let encBytes = sodium.crypto_box_seal(binsec, binkey)

  // Convert encrypted Uint8Array to Base64
  let output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)
outpu = output ;
  console.log(output);
  getRepo();
});



async function getRepo() {
  const octokit = new Octokit({
    auth: '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'
  });

  try {
    const response =await octokit.request('PUT /repos/SS0809/my-new-repo/actions/secrets/ACCESS_TOKEN', {
  owner: 'SS0809',
  repo: 'my-new-repo',
  secret_name: 'ACCESS_TOKEN',
  encrypted_value: outpu,
  key_id: key_id,
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
}) } catch (error) {
    console.error('Error retrieving repo public key:', error);
  }
}


