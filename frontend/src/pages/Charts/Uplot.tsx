import isEqual from 'lodash-es/isEqual';
import React, { Component, memo } from 'react';
import UPlot from 'uplot';

interface UplotProps {
	data: uPlot.AlignedData;
	options: uPlot.Options;
}

class UplotComponent extends Component<UplotProps> {
	private plotRef: React.RefObject<HTMLDivElement>;

	private plot?: uPlot;

	constructor(props: UplotProps) {
		super(props);
		this.plotRef = React.createRef();
	}

	componentDidMount(): void {
		this.createPlot();
	}

	componentDidUpdate(prevProps: UplotProps): void {
		const { data, options } = this.props;
		if (!isEqual(prevProps.data, data) && this.plot) {
			console.log('componentDidUpdate', 'data');
			this.plot?.setData(data);
		}

		if (!isEqual(prevProps.options, options) && this.plot) {
			console.log('componentDidUpdate', 'options', {
				options,
				prevProps: prevProps.options,
			});
			this.plot?.destroy();
			this.createPlot();
		}
	}

	componentWillUnmount(): void {
		this.plot?.destroy();
	}

	createPlot(): void {
		const { data, options } = this.props;
		if (this.plotRef.current) {
			this.plot = new UPlot(options, data, this.plotRef.current);
		}
	}

	render(): JSX.Element {
		return <div ref={this.plotRef} />;
	}
}

export default memo(UplotComponent, isEqual);
