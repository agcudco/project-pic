import React, { useState } from 'react';
import LoginTable from './LoginTable';
import LoginForm from './LoginForm';

export default function LoginManager() {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="p-grid">
            <div className="p-col-7">
                <LoginTable onEdit={setSelectedUser} />
            </div>
            <div className="p-col-5">
                {selectedUser && <LoginForm user={selectedUser} />}
            </div>
        </div>
    );
}
