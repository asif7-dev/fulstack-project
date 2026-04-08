package com.cafe.backend.util;

public final class UnitConversionUtil {

    private UnitConversionUtil() {
    }

    public static double toBaseUnit(double quantity, String unit) {
        String normalized = normalize(unit);
        return switch (normalized) {
            case "kg", "kilogram", "kilograms" -> quantity * 1000.0;
            case "gram", "grams", "g" -> quantity;
            case "litre", "liter", "liters", "litres", "l" -> quantity * 1000.0;
            case "ml", "milliliter", "millilitre", "milliliters", "millilitres" -> quantity;
            default -> quantity;
        };
    }

    public static double fromBaseUnit(double baseQuantity, String displayUnit) {
        String normalized = normalize(displayUnit);
        return switch (normalized) {
            case "kg", "kilogram", "kilograms" -> baseQuantity / 1000.0;
            case "gram", "grams", "g" -> baseQuantity;
            case "litre", "liter", "liters", "litres", "l" -> baseQuantity / 1000.0;
            case "ml", "milliliter", "millilitre", "milliliters", "millilitres" -> baseQuantity;
            default -> baseQuantity;
        };
    }

    public static String baseUnitFor(String displayUnit) {
        String normalized = normalize(displayUnit);
        return switch (normalized) {
            case "kg", "kilogram", "kilograms", "gram", "grams", "g" -> "gram";
            case "litre", "liter", "liters", "litres", "l", "ml", "milliliter", "millilitre", "milliliters", "millilitres" -> "ml";
            default -> normalize(displayUnit);
        };
    }

    private static String normalize(String unit) {
        return unit == null ? "" : unit.trim().toLowerCase();
    }
}
