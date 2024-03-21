import React from 'react';
import { render } from '@testing-library/react-native';
import SplashScreen from '.';
import { TEST_LABELS } from './constants/testLabels';

describe('<SplashScreen />', () => {
  it('renders correctly', () => {
    
    const navigation = { navigate: jest.fn() };
    const { getByLabelText } = render(<SplashScreen navigation={navigation}/>);
    const backgroundImageComponent = getByLabelText(TEST_LABELS.BACKGROUND_IMAGE);
    expect(backgroundImageComponent).toBeDefined();
  });
});


