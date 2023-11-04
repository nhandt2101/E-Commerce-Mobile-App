import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { getData, storeData } from "../../component/store";
import { updateUser } from '../../db/user';

const ChangeProfile = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [isChangePass, setIsChangePass] = useState(false);
    const [error, setError] = useState(null);
    const [oldPassword, setOldPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data_user = await getData("@user");
            setUser(data_user);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveProfile = async () => {
        if (newPassword != null) {
            if (oldPassword != user.password) {
                setError("Mat khau cu khong dung");
                return;
            }
            if (newPassword != confirmPassword) {
                setError("Mat khau nhap lai khong khop");
                return;
            }

            try {
                setUser((prevUser) => ({
                    ...prevUser,
                    password: newPassword,
                }));
                await updateUser(user.id, user.name, user.age, user.email, newPassword, user.isSale, user.address);
                await storeData("@user", user);
                setError(null);
                alert("Thành công");
            } catch (error) {
                console.error("Lỗi khi update hoặc lưu dữ liệu:", error);
            }
        } else {
            try {
                await updateUser(user.id, user.name, user.age, user.email, user.password, user.isSale, user.address);
                await storeData("@user", user);
                setError(null);
                alert("Thành công");
            } catch (error) {
                console.error("Lỗi khi update hoặc lưu dữ liệu:", error);
            }
        }

        
    }

    const Changepassword = () => {
        setNewPassword(null);
        setError(false);
        setIsChangePass(true);
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }


    if (isChangePass) {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>Old Password:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={(text) => setOldPassword(text)}
                />

                <Text style={styles.label}>New Password:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={(text) => setNewPassword(text)}
                />

                <Text style={styles.label}>Confirm Password:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={(text) => setConfirmPassword(text)}
                />

                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}

                <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
                    <Text style={styles.buttonText}>Save Password</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
                style={styles.input}
                value={user.name}
                onChangeText={(text) => setUser({ ...user, name: text })}
            />

            <Text style={styles.label}>Address:</Text>
            <TextInput
                style={styles.input}
                value={user.address}
                onChangeText={(text) => setUser({ ...user, address: text })}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
            />

            <Text style={styles.label}>Age:</Text>
            <TextInput
                style={styles.input}
                value={user.age}
                onChangeText={(text) => setUser({ ...user, age: text })}
            />

            <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
                <Text style={styles.buttonText}>Save Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.changePasswordButton} onPress={Changepassword}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
    },
    changePasswordButton: {
        backgroundColor: 'green',
        borderRadius: 5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        marginBottom: 5,
        fontWeight: "bold",
    }
});

export default ChangeProfile;