import React, { useState, useEffect } from "react";
import { ScreenOrientation } from "expo";
import {
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
	View,
	Image
} from "react-native";
import { Audio } from "expo-av";
import sources from "./assets/audio";
import { twinkle, bells } from "./songs";

const sharps = [1, 3, 6, 8, 10];
const keys = [...Array(sources.length).keys()].filter(k => !sharps.includes(k));
const ogColors = [...Array(sources.length).keys()].map(a =>
	sharps.includes(a) ? "black" : "white"
);

const KEY_HEIGHT = 180;
const KEY_WIDTH = 62;
const SHARP_HEIGHT = 120;
const SHARP_WIDTH = 38;

async function playSound(key) {
	Audio.Sound.createAsync(sources[key], {
		shouldPlay: true,
		playsInSilentModeIOS: true
	});
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

let playerId = 0;

export default function App() {
	const [song, setSong] = useState(null);
	const [colors, setColors] = useState(ogColors);

	useEffect(() => {
		ScreenOrientation.lockAsync(
			ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
		);
	}, []);

	const playKey = key => {
		playerId = 0;
		setSong(null);
		setColors(colors.map((c, i) => (i == key ? "#dadada" : c)));
		setTimeout(() => {
			playSound(key);
		}, 1);
	};

	const playSharp = key => {
		setColors(colors.map((c, i) => (i == key ? "#4e4e4e" : c)));
		setTimeout(() => {
			playSound(key);
		}, 1);
	};

	async function playSong(song) {
		const currentId = Date.now();
		playerId = currentId;
		for (let i = 0; i < song.length; i++) {
			const key = song[i][0];
			const delay = song[i][1] * 100;
			if (playerId == currentId) {
				playSound(key);
				setColors(colors.map((c, j) => (j == key ? "#dadada" : ogColors[j])));
				await sleep(delay);
				setColors(ogColors);
				await sleep(10);
			}
		}
		if (playerId == currentId) {
			playerId = 0;
			setSong(null);
		}
	}

	return (
		<ImageBackground
			style={styles.container}
			source={
				song === "twinkle"
					? require("./assets/stars.jpg")
					: song === "bells"
					? require("./assets/christmas.jpg")
					: ""
			}
		>
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
						onTouchStart={() => playKey(key)}
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
							onTouchStart={() => playSharp(key)}
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
			<View style={{ marginLeft: 50 }}>
				<TouchableOpacity
					onPress={() => {
						setSong("bells");
						playSong(bells);
					}}
				>
					<Image
						style={{ width: 50, height: 80 }}
						source={require("./assets/bells.png")}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setSong("twinkle");
						playSong(twinkle);
					}}
				>
					<Image
						style={{ width: 50, height: 50, marginTop: 20 }}
						source={require("./assets/twinkle.png")}
					/>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF",
		flexDirection: "row",
		backgroundColor: "white"
	}
});
