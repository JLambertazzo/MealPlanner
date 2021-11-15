const massMeasures = ['kg', 'g', 'oz', 'lb']
const volMeasures = ['ml', 'l', 'tsp', 'Tbs', 'cup', 'pnt']

export const isDefaultMeasurement = (unit: string) => {
    const mass = massMeasures.find(mUnit => mUnit.replace(/\s/g, '').toUpperCase() === unit.replace(/\s/g, '').toUpperCase())
    const vol = volMeasures.find(mUnit => mUnit.replace(/\s/g, '').toUpperCase() === unit.replace(/\s/g, '').toUpperCase())
    if (mass || vol) {
        return true
    }
    return false
}