/**
 * @file This file exports a function with some syntactic sugar to replace the ugly try/catch block needed to use async/await.
 * Use it as a wrapper for  any function that requires a try/catch block.
 * @author Gabriel <gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

module.exports = (execution) => (req, res, next) => {
    execution(req, res, next).catch(next);
  };
  