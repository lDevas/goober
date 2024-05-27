'use server'
import { api } from '~/trpc/server';

export async function getRider(riderId) {
  return await api.rider.get({ riderId: parseInt(riderId) });
}