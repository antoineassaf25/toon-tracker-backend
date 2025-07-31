import { updateAllToons } from './updateAllToons';

export async function runOnce(): Promise<void> {
  console.log('runOnce start');
  await updateAllToons();
  console.log('runOnce done');
}