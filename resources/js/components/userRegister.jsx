import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const Form = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [roleId, setRoleId] = useState('');
    const [roleName, setRoleName] = useState('');
    const [message, setMessage] = useState('');
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [description, setDescription] = useState('');
    
    useEffect(() => {
        // Fetch roles and users on component mount
        axios.get('/roles').then(response => {
            setRoles(response.data);
        }).catch(error => {
            console.error('Error fetching roles:', error);
        });

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/users');
            setUsers(response.data);
            const roleNames = await axios.get('/user/'+response.data.id);
            console.log(roleNames.data);
            setRoleName(roleNames.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('profile_image', profileImage);
        formData.append('role_id', roleId);
        formData.append('description', description);
        formData.append('_token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));

        try {
            const response = await axios.post('/register-user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('<i className="float-right badge bg-success mb-2">' + response.data.message+ '</i>');
            fetchUsers(); // Refresh the user list after submission
            setErrors({});
        } catch (error) {
            console.log(error)
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setMessage('<i className="badge bg-danger mb-2">Error submitting form.</i>');
                console.error('Submission error:', error);
            }
            //setMessage('Error submitting form.');
        }
    };

    return (
        <div className='container mt-3'>
            <div className='row'>
                
                <h1 className='bg-warning text-white p-2'>User Registration</h1>
                {message && {message}}
                <form onSubmit={handleSubmit}>
                    <div className='col-lg-4 col-md-4 mb-2 float-left'>
                        
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            placeholder='Name:'
                            value={name}
                            className='form-control-sm'
                            onChange={(e) => setName(e.target.value)}
                            
                        />
                        {errors.name && <p className="text-danger">{errors.name[0]}</p>}
                    </div>
                    <div className='col-lg-4 col-md-4 mb-2 float-left'>
                        
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder='Email:'
                            value={email}
                             className='form-control-sm'
                            onChange={(e) => setEmail(e.target.value)}
                            
                        />
                        {errors.email && <p className="text-danger">{errors.email[0]}</p>}
                    </div>
                    <div className='col-lg-4 col-md-4  mb-2 float-left'>
                        <input 
                            type="text" 
                            id="phone" 
                            name="phone" 
                            value={phone}
                            placeholder='Phone:'
                            className='form-control-sm'
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        {errors.phone && <p className="text-danger">{errors.phone[0]}</p>}
                    </div>
                    <div className='clearfix'></div>
                    <div className='col-lg-4 col-md-4 mb-2 float-left'>
                        <input 
                            type="file" 
                            id="profile_image" 
                            name="profile_image" 
                            className='form-control-sm'
                            onChange={(e) => setProfileImage(e.target.files[0])}
                        />
                        {errors.profile_image && <p className="text-danger">{errors.profile_image[0]}</p>}
                    </div>
                    <div className='col-lg-4 col-md-4 mb-2 float-left'>
                    
                    <select 
                        id="role_id" 
                        name="role_id" 
                        value={roleId}
                        className='form-control-sm'

                        onChange={(e) => setRoleId(e.target.value)}
                        
                    >
                        <option value="">Select a role</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    {errors.role_id && <p className="text-danger">{errors.role_id[0]}</p>}
                    </div>
                    <div className='col-lg-4 col-md-4 mb-2 float-left'>
                        <textarea id='desc' name="description" className='form-control-sm'
                             value={description}
                             onChange={(e) => setDescription(e.target.value)}
                             rows="4"
                             placeholder='Description'
                         />
                         {errors.description && <div className="invalid-feedback">{errors.description[0]}</div>}
                     
                    </div>
                    
                    <div className='clearfix'></div>
                    <hr></hr>
                    <div className='col-lg-12 col-md-12 mb-2 float-left '>
                        <button className='btn btn-primary float-right' type="submit">Submit</button>
                    </div>
                </form>
                
                   
                <h2 className='bg-secondary text-dark p-2'>User List</h2>
                <hr></hr>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Profile Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.role_id/* {roleName.map(role => ( {role.role_name})} */}</td>
                                <td>
                                    {user.profile_image && (
                                        <img
                                            src={`${user.profile_image}`}
                                            alt="Profile"
                                            style={{ width: '50px', height: '50px' }}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Form;
