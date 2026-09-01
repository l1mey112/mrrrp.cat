// https://github.com/FxEmbed/FxEmbed/blob/62ff694524c1e2602c77642b2bad0672e12be081/src/helpers/snowcode.ts
// modifications have been adding jsdoc type annotations
/*
The MIT License (MIT)

Copyright (c) 2022-2026 dangered wolf and FxEmbed contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]":,.-_';

/** @param {object} json */
export const encodeSnowcode = (json) => {
  const jsonStr = JSON.stringify(json).slice(1, -1);
  let result = '';
  for (const char of jsonStr) {
    // Get the index of the character in the allowedChars string.
    const index = allowedChars.indexOf(char);
    if (index === -1) {
      throw new Error('Character not allowed: ' + char);
    }
    // Convert the index to a two-digit string (e.g., 3 -> "03").
    const code = index.toString().padStart(2, '0');
    result += code;
  }
  return result;
};

/** @param {string} numStr */
export const decodeSnowcode = (numStr) => {
  const str = numStr.match(/\d+/)?.join('') ?? '';
  if (str.length % 2 !== 0) {
    throw new Error('Invalid encoded string length.');
  }
  let result = '';
  for (let i = 0; i < str.length; i += 2) {
    const codeStr = str.slice(i, i + 2);
    const index = parseInt(codeStr, 10);
    if (index < 0 || index >= allowedChars.length) {
      throw new Error('Invalid code: ' + codeStr);
    }
    result += allowedChars[index];
  }
  const resultStr = `{${result}}`;
  return JSON.parse(resultStr);
};
