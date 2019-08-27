/**
 * Internal dependencies
 */
import Inspector from "./components/inspector";

import React from "react";
import memoize from "memize";
import times from "lodash/times";

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;

const { InnerBlocks, BlockControls } = wp.editor;

const { applyFilters } = wp.hooks;

const { withInstanceId } = wp.compose;

const ALLOWED_BLOCKS = ["c9-blocks/carousel-slide"];

// External Dependencies.
import classnames from "classnames";

class Edit extends Component {
	constructor() {
		super(...arguments);

		const { autoSlide, wrapAround } = this.props.attributes;

		this.carouselRef = React.createRef();
		this.state = {
			auto: autoSlide,
			wrap: wrapAround,
			active: 0
		};

		this.createIndicators = this.createIndicators.bind(this);
	}

	componentDidMount() {
		const $ = window.jQuery;
		let self = this;

		$(this.carouselRef.current).on("slide.bs.carousel", function({ to }) {
			self.setState({ active: to });
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			0 <= nextState.active && nextState.active < nextProps.attributes.slides
		);
	}

	componentDidUpdate() {
		const { block, updateBlockAttributes } = this.props;

		// eslint-disable-next-line no-unused-vars
		for (let child of block.innerBlocks) {
			updateBlockAttributes(child.clientId, { slideActive: this.state.active });
		}

		const { auto, wrap } = this.state;
		const { autoSlide, wrapAround } = this.props.attributes;
		const $ = window.jQuery;

		if ($(this.carouselRef.current).data()["bs.carousel"]) {
			let options = $(this.carouselRef.current).data()["bs.carousel"]._config;

			if (auto != autoSlide) {
				let interval = autoSlide ? 5000 : false;
				options.interval = interval;
				this.setState({ auto: autoSlide });
			}

			if (wrap != wrapAround) {
				options.wrap = wrapAround;
				this.setState({ wrap: wrapAround });
			}
		}
	}

	createIndicators(slides, id) {
		const { active } = this.state;
		const { isSelectedBlockInRoot } = this.props;

		let indicators = [];
		for (let i = 0; i < slides; i++) {
			indicators.push(
				<li
					data-target={`#c9-carousel-indicator-${id}`}
					data-slide-to={i}
					className={classnames(
						i == active ? "active" : null,
						isSelectedBlockInRoot ? "editor-selected-controls-lift" : null
					)}
				/>
			);
		}

		return indicators;
	}

	getSlidesTemplate = memoize(slides => {
		let templates = times(slides, id => [
			"c9-blocks/carousel-slide",
			{ id, slideActive: this.state.active, slides }
		]);

		return templates;
	});

	render() {
		const {
			attributes,
			className = "",
			instanceId,
			isSelectedBlockInRoot,
			setAttributes
		} = this.props;

		const {
			autoSlide,
			slides,
			wrapAround,
			showControls,
			showIndicators
		} = attributes;

		if (instanceId != attributes.instanceId) {
			setAttributes({ instanceId });
		}

		return (
			<Fragment>
				<BlockControls />

				<Inspector
					{...this.props}
					carouselRef={this.carouselRef}
					slideTarget={this.state.active}
				/>
				<div
					id={`c9-carousel-indicator-${instanceId}`}
					className={classnames(
						applyFilters("c9-blocks.blocks.className", className),
						"carousel slide"
					)}
					data-ride="carousel"
					data-interval={autoSlide ? 5000 : false}
					data-wrap={wrapAround}
					ref={this.carouselRef}
				>
					<ol
						className={classnames(
							"carousel-indicators",
							!showIndicators ? "hide-indicator" : null
						)}
					>
						{this.createIndicators(slides, instanceId)}
					</ol>
					<div className="carousel-inner">
						<InnerBlocks
							template={this.getSlidesTemplate(slides)}
							templateLock="all"
							allowedBlocks={ALLOWED_BLOCKS}
						/>
					</div>
					{showControls && (
						<Fragment>
							<a
								className={classnames(
									"carousel-control-prev",
									isSelectedBlockInRoot ? "editor-selected-controls-lift" : null
								)}
								href={`#c9-carousel-indicator-${instanceId}`}
								role="button"
								data-slide="prev"
							>
								<span
									className="carousel-control-prev-icon"
									aria-hidden="true"
								/>
								<span className="sr-only">Previous</span>
							</a>
							<a
								className={classnames(
									"carousel-control-next",
									isSelectedBlockInRoot ? "editor-selected-controls-lift" : null
								)}
								href={`#c9-carousel-indicator-${instanceId}`}
								role="button"
								data-slide="next"
							>
								<span
									className="carousel-control-next-icon"
									aria-hidden="true"
								/>
								<span className="sr-only">Next</span>
							</a>
						</Fragment>
					)}
				</div>
			</Fragment>
		);
	}
}

export default withInstanceId(Edit);
