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
    Image
} from "react-native";
import { loginService } from "../services/loginService";


export default function LoginScreen() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const success = await loginService.login({ email, password });
            if (!success) {
                setError("Invalid email or password");
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
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
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
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Enter your password"
                            secureTextEntry={true}
                        />
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity 
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
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
