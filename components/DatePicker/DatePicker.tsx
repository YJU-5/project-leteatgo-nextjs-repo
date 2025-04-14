import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

const StyledDatePicker = styled(DatePicker)({
  width: "100%",
  margin: "0",
  padding: "0",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  "& .MuiPickersDay-root": {
    color: "#000000",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    "&.Mui-selected": {
      backgroundColor: "#564b9a",
      borderRadius: "10px",
      color: "#ffffff",
      "&:hover": {
        backgroundColor: "#443a7a",
        borderRadius: "10px",
      },
    },
    "&:hover": {
      backgroundColor: "#f0edf7",
      borderRadius: "10px",
    },
  },
  "& .MuiPickersCalendarHeader-root": {
    color: "#000000",
    borderRadius: "10px",
  },
  "& .MuiPickersCalendarHeader-label": {
    color: "#000000",
    borderRadius: "10px",
  },
  "& .MuiInputBase-root": {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    "& .MuiInputBase-input": {
      color: "#000000",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666666",
    borderRadius: "10px",
  },
});

interface DatePickerProps {
  value: Date | null;
  onChange: (newValue: Date | null) => void;
}

export default function DatePickerComponent({
  value,
  onChange,
}: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker", "DatePicker"]}>
        <StyledDatePicker
          format="YYYY.MM.DD"
          showDaysOutsideCurrentMonth
          value={value ? dayjs(value) : null}
          onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
          views={["year", "month", "day"]}
          openTo="month"
          slotProps={{
            textField: {
              size: "small",
            },
            popper: {
              placement: "bottom-end",
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 8],
                  },
                },
              ],
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
