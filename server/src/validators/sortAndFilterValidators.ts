import { ValidationError } from '../errors';
import { FilterCriteria, SortingCriteria } from '../types';
import { isNumber, isNumberOrUndefined } from './basicTypeValidators';

const criterias = ['age', 'distance', 'rating', 'tags'] as const;
type Criteria = typeof criterias[number];

const orderType = ['asc', 'desc'] as const;
type Order = typeof orderType[number];

const isCriteria = (criteria: unknown): criteria is Criteria => {
	return typeof criteria === 'string' && criterias.includes(criteria as Criteria);
};

const isOrder = (order: unknown): order is Order => {
	return typeof order === 'string' && orderType.includes(order as Order);
};

const parseCriteria = (criteria: unknown): Criteria => {
	if (!isCriteria(criteria)) {
		throw new ValidationError(`Invalid format of criteria`);
	}
	return criteria;
};

const parseOrder = (order: unknown): Order => {
	if (!isOrder(order)) throw new ValidationError('Invalid order format');
	return order;
};

const parseMax = (max: unknown): number | undefined => {
	if (!isNumberOrUndefined(max)) throw new ValidationError(`Invalid max value in filter criteria validation.`);
	return max;
};

export const parseSortCriteria = (sortingCriteria: unknown): SortingCriteria => {
	if (sortingCriteria && typeof sortingCriteria === 'object' && 'sort' in sortingCriteria && 'order' in sortingCriteria) {
		const { sort, order } = sortingCriteria as { sort: unknown; order: unknown };
		const parsedSortingCriteria = {
			sort: parseCriteria(sort),
			order: parseOrder(order)
		};
		return parsedSortingCriteria;
	}
	throw new ValidationError(`Invalid format of sorting criteria`);
};

export const parseFilterCriteria = (filterCriteria: unknown): FilterCriteria => {
	if (filterCriteria && typeof filterCriteria === 'object' && 'filter' in filterCriteria && 'min' in filterCriteria && 'max' in filterCriteria) {
		const { filter, min, max } = filterCriteria as { filter: unknown; min: unknown, max: unknown };
		if (!isNumber(min)) throw new ValidationError(`Invalid min value in filter criteria validation.`);
		const parsedFilterCriteria = {
			filter: parseCriteria(filter),
			min,
			max: parseMax(max)
		};
		return parsedFilterCriteria;
	}
	throw new ValidationError(`Invalid format of filter criteria`);
};

export const parseFilterCriterias = (filterCriterias: unknown): FilterCriteria[] => {
	if (!filterCriterias || !Array.isArray(filterCriterias)) throw new ValidationError('Incorrectly formatted filters');
	return filterCriterias.map(parseFilterCriteria);
};
