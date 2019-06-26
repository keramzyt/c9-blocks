/**
 * Internal block libraries
 */
// import CustomRadio from './custom-radio';

import React from "react";
const { Component } = wp.element;

/**
 * Create an VideoBox Controls wrapper Component
 */
export default class VideoBox extends Component {
	constructor() {
		super(...arguments);
		this.videoRef = React.createRef();
		this.canPlay = this.canPlay.bind(this);
		console.log('test');
	}

	canPlay() {
		console.log("ready!!!");

		if (this.videoRef && this.videoRef.current) {
			console.log(this.videoRef.current);
			let op = 0;

			let element = this.videoRef.current;
			element.style.opacity = 1;
		}
	}

	render() {
		const {
			attributes: {
				verticalAlign,
				containerImgURL,
				containerImgID,
				containerWidth,
				bgImgSize,
				bgImgAttach,
				overlayHue,
				overlayOpacity,
				bgImgPosX,
				bgImgPosY,
				blendMode,
				containerPadding,
				columns,
				minScreenHeight,
				focalPoint,
				videoType,
				containerVideoURL
			},
			setAttributes
		} = this.props;

		const cortexVideoStyles = (videoType, containerVideoURL) => {
			const styles = {};
			if (videoType == "upload") {
				styles.opacity = 0;
				styles.transition = "5000ms";
				styles.maxWidth = "100%";
			}

			return styles;
		};

		if (containerVideoURL && videoType == "upload") {
			return (
				<video
					id="containerVideo"
					playsinline="playsinline"
					autoPlay="autoplay"
					muted="muted"
					loop="loop"
					onCanPlayThrough={this.canPlay}
					ref={this.videoRef}
					style={cortexVideoStyles(videoType, containerVideoURL)}
				>
					<source src={`${containerVideoURL}`} type="video/mp4" />
				</video>
			);
		} else if (containerVideoURL && videoType == "embed") {
			return <div />;
		} else {
			return <div />;
		}
	}
}
