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
    Modal,
} from "react-native";

export default function SignupScreen({ navigation }: { navigation: any }) {
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [country, setCountry] = React.useState("ar");
    const [sex, setSex] = React.useState("M");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [showCountryPicker, setShowCountryPicker] = React.useState(false);
    const [showSexPicker, setShowSexPicker] = React.useState(false);

    const countries = [
        { label: "Argentina", value: "ar" },
        // Add more countries as needed
    ];

    const sexes = [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" },
        { label: "Other", value: "O" },
    ];

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
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setShowCountryPicker(true)}
                        >
                            <Text style={styles.dropdownButtonText}>
                                {countries.find(c => c.value === country)?.label || "Select Country"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Sex</Text>
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setShowSexPicker(true)}
                        >
                            <Text style={styles.dropdownButtonText}>
                                {sexes.find(s => s.value === sex)?.label || "Select Sex"}
                            </Text>
                        </TouchableOpacity>
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

            <Modal
                visible={showCountryPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country</Text>
                            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                <Text style={styles.modalCloseButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                        {countries.map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                style={[
                                    styles.modalItem,
                                    country === item.value && styles.modalItemSelected
                                ]}
                                onPress={() => {
                                    setCountry(item.value);
                                    setShowCountryPicker(false);
                                }}
                            >
                                <Text style={[
                                    styles.modalItemText,
                                    country === item.value && styles.modalItemTextSelected
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showSexPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowSexPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Sex</Text>
                            <TouchableOpacity onPress={() => setShowSexPicker(false)}>
                                <Text style={styles.modalCloseButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                        {sexes.map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                style={[
                                    styles.modalItem,
                                    sex === item.value && styles.modalItemSelected
                                ]}
                                onPress={() => {
                                    setSex(item.value);
                                    setShowSexPicker(false);
                                }}
                            >
                                <Text style={[
                                    styles.modalItemText,
                                    sex === item.value && styles.modalItemTextSelected
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
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
    dropdownButton: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 16,
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
    },
    dropdownButtonText: {
        fontSize: 16,
        color: "#333",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    modalCloseButton: {
        fontSize: 16,
        color: "#007AFF",
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    modalItemSelected: {
        backgroundColor: "#f0f0f0",
    },
    modalItemText: {
        fontSize: 16,
        color: "#333",
    },
    modalItemTextSelected: {
        color: "#007AFF",
        fontWeight: "600",
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