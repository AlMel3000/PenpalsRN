import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing } from 'react-native';

export default class RotatingView extends Component {
    state = {
        spinValue: new Animated.Value(1),
    }

    componentDidMount() {
        Animated.loop(Animated.timing(
            this.state.spinValue,                                   // The animated value to drive
            {
                toValue: this.props.toValue || 0,                   // Animate to 360/value
                duration: this.props.duration || 2000,              // Make it take a while
                easing: Easing.linear,
                useNativeDriver: true,
            }
        ),
            {
                iterations: 55
            }
    ).start(this.props.onFinishedAnimating);                    // Starts the animation
    }

    render() {
        let spin = this.state.spinValue.interpolate({
            inputRange: [0,1],
            outputRange: ['0deg', '360deg']
        });
        return (
            <Animated.View
                style={{
                    ...this.props.style,
                    transform: [{rotate:spin}],                     // Bind rotation to animated value
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
};


RotatingView.propTypes = Object.assign({},Animated.View.propTypes,{
    duration: PropTypes.number,             //How long
    toValue: PropTypes.number,              //How much rotation, eg. 0.5 will rotate 180deg
    onFinishedAnimating: PropTypes.func,    //What to do when animation finishes, see Aminated docs
});