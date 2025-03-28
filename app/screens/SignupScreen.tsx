import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function SignupScreen({ navigation }: { navigation: any }) {
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [country, setCountry] = React.useState("ar");
    const [sex, setSex] = React.useState("M");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSignup = async () => {
        if (!email || !name || !username || !password) {
            setError("Please fill in all required fields");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch('http://143.244.190.174:8443/general/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name,
                    username,
                    country,
                    new: true,
                    sex,
                    password,
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                navigation.navigate('Login');
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email *</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setName}
                            value={name}
                            placeholder="Enter your full name"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Username *</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setUsername}
                            value={username}
                            placeholder="Choose a username"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Country</Text>
                        <Picker
                            selectedValue={country}
                            onValueChange={(itemValue) => setCountry(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Argentina" value="ar" />
                            {/* Add more countries as needed */}
                        </Picker>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Sex</Text>
                        <Picker
                            selectedValue={sex}
                            onValueChange={(itemValue) => setSex(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Male" value="M" />
                            <Picker.Item label="Female" value="F" />
                            <Picker.Item label="Other" value="O" />
                        </Picker>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password *</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Create a password"
                            secureTextEntry={true}
                        />
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    header: {
        marginBottom: 40,
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
    },
    form: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    picker: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
    },
    button: {
        backgroundColor: "#007AFF",
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: "#999",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    errorText: {
        color: "#ff3b30",
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
    },
}); 