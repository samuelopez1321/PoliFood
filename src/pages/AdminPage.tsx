import type { User } from '../types';

interface AdminPageProps {
    currentUser: User | null;
}

export const AdminPage = ({currentUser}: AdminPageProps) => {
    return(<h1>Admin Page</h1>);
}