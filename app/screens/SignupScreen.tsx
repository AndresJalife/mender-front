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
import { router } from "expo-router";
import { loginService } from "../services/loginService";
import { colors } from "../constants/colors";
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
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
        { label: "United States", value: "us" },
        { label: "Canada", value: "ca" },
        { label: "United Kingdom", value: "uk" },
        { label: "Australia", value: "au" },
        { label: "New Zealand", value: "nz" },
        { label: "South Africa", value: "za" },
        { label: "India", value: "in" },
        { label: "Brazil", value: "br" },
        { label: "Mexico", value: "mx" },
        { label: "Argentina", value: "ar" },
        { label: "Chile", value: "cl" },
        { label: "Colombia", value: "co" },
        { label: "Peru", value: "pe" },
        { label: "Venezuela", value: "ve" },
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
            const response = await loginService.signup({
                email,
                name,
                username,
                country,
                sex,
                password,
            });
            
            if (response.success) {
                const success = await loginService.login({ email, password });
                if (!success) {
                    setError("Invalid email or password");
                }
                router.replace("/screens/MainScreen");
            } else {
                setError(response.message || "Registratiron failed");
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
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
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
        backgroundColor: colors.background,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
        padding: 10,
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
        color: colors.textPrimary,
        marginBottom: 8,
        paddingTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    form: {
        backgroundColor: colors.surface,
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
        color: colors.textSecondary,
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: colors.surfaceLight,
        color: colors.textPrimary,
    },
    dropdownButton: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        justifyContent: "center",
        backgroundColor: colors.surfaceLight,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: colors.surface,
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
        color: colors.textPrimary,
    },
    modalCloseButton: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalItemSelected: {
        backgroundColor: colors.surfaceLight,
    },
    modalItemText: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    modalItemTextSelected: {
        color: colors.textPrimary,
        fontWeight: "600",
    },
    button: {
        backgroundColor: colors.surfaceLighter,
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: colors.textMuted,
    },
    buttonText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "600",
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
    },
}); 