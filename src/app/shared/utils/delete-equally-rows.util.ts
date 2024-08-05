import { similarityDetectorService } from '../../services/similarity-detector';

export function deleteEquallyRows<T>(arr1: T[], arr2: T[], equalizeParam: string): T[] {
    return arr1.filter((row1) => !arr2.find(row2 => similarityDetectorService.detect(
        //@ts-ignore
        String(row1[equalizeParam]), String(row2[equalizeParam])
    )))
}