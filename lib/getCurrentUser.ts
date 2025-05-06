import { cookies } from 'next/headers';
import prisma from './prisma';

export async function getCurrentUser() {
 const token = (await cookies()).get("token")?.value
    
 if (!token) {
    return null;
 }

 const session = await prisma.session.findUnique({
    where : {token},
    include: {user: true},
 })

 if (!session || new Date() > session.expiresAt) return null;

 return session.user;
}