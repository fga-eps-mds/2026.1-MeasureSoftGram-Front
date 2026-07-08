import { Slider } from '@mui/material';
import styled from 'styled-components';

export const StyledSlider = styled(Slider)({
  color: '#2B4D6F',
  width: 30,
  '& .MuiSlider-track': {
    border: 'none',
    transition: `left 1s ease-in`,
    backgroundImage: 'linear-gradient(#2DA1C8, #2B4D6F)'
  },
  '& .MuiSlider-thumb': {
    color: '#2B4D6F',
    backgroundColor: '#fff',
    height: 20,
    width: 35,
    borderRadius: '8px',
    border: '3px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit'
    },
    '&::before': {
      display: 'none'
    }
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#2B4D6F'
  }
});