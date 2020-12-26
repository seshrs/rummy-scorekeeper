import Storage from '../../utils/Storage';

export function isScorekeeper() {
  const role = Storage.get('role');
  return role && role === 'scorekeeper';
}
