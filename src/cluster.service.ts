/* eslint-disable @typescript-eslint/ban-types */
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

dotenv.config();

console.log(`Number of CPUs: ${parseInt(process.env.NUM_CORES as string)}`);
const numCPUs = process.env.NUM_CORES
  ? parseInt(process.env.NUM_CORES)
  : availableParallelism();
@Injectable()
export class ClusterService {
  static clusterize(callback: Function): void {
    if (cluster.isPrimary) {
      console.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      console.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
