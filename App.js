import React, { useState, useEffect } from "react";
import { ScreenOrientation } from "expo";
import { StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import sources from "./audio";

const sharps = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22];
const keys = [...Array(sources.length).keys()].filter(k => !sharps.includes(k));
const ogColors = [...Array(sources.length).keys()].map(a =>
	sharps.includes(a) ? "black" : "white"
);

const KEY_HEIGHT = 160;
const KEY_WIDTH = 42;
const SHARP_HEIGHT = 100;
const SHARP_WIDTH = 28;

const sounds = [];
async function playSound(key) {
	const { sound } = await Audio.Sound.create(sources[key], {
		shouldPlay: true,
		playsInSilentModeIOS: true
	});
	sounds[key] = sound;
}

export default function App() {
	const [colors, setColors] = useState(ogColors);

	useEffect(() => {
		ScreenOrientation.lockAsync(
			ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
		);
	}, []);

	return (
		<View style={styles.container}>
			<View
				style={{
					position: "relative",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					borderTopWidth: 1,
					borderRightWidth: 1
				}}
			>
				{keys.map(key => (
					<View
						onTouchStart={() => {
							setColors(colors.map((c, i) => (i == key ? "#dadada" : c)));
							setTimeout(() => {
								playSound(key);
							}, 1);
						}}
						onTouchEnd={() => {
							setColors(ogColors);
						}}
						style={{
							backgroundColor: colors[key],
							height: KEY_HEIGHT,
							width: KEY_WIDTH,
							borderBottomWidth: 1,
							borderLeftWidth: 1
						}}
					></View>
				))}
				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0
					}}
				>
					{sharps.map((key, i) => (
						<View
							onTouchStart={() => {
								setColors(colors.map((c, i) => (i == key ? "#4e4e4e" : c)));
								setTimeout(() => {
									playSound(key);
								}, 1);
							}}
							onTouchEnd={() => {
								setColors(ogColors);
							}}
							style={{
								backgroundColor: colors[key],
								position: "absolute",
								top: 0,
								left:
									keys.filter(k => k < key).length * KEY_WIDTH -
									SHARP_WIDTH / 2,
								height: SHARP_HEIGHT,
								width: SHARP_WIDTH
							}}
						></View>
					))}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF",
		flexDirection: "row"
	}
});
