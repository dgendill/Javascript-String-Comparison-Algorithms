var fuzzySearch = (function() {
	var jaroDistance = function(string1, string2) {
		// Returns Jaro Distance
		var l1 = string1.length,
			l2 = string2.length,
			matchedIndexes = [],
			matchedIndexes2 = [],
			numberMatched = 0;
			transpositions = 0,
			halfTranspositions = 0,
			maxDistance = Math.floor(Math.max(l1,l2)/2)-1,
			jd = 0; // jaro distance
			
		var inDistance = function(distance) { 
			if (distance <= maxDistance) {
				return true;
			} else {
				return false;	
			}
		}
		
		// count the matches
		var getMatching = function(topString, bottomString) {
			// first time calling this function
			// matches will be empty...  The second time we 
			// just need to do a basic comparison
			var tsLength = topString.length,
				bsLength = bottomString.length,
				tempMatchedIndexes = [],
				matches = [];

			for (var a = 0; a < tsLength; a++) {
				var matchFound = (function () {
					for (var b = 0; b < bsLength; b++) {
						if (topString[a] === bottomString[b]) {
							//string1[a] and string2[b] match
							if (tempMatchedIndexes.indexOf(b) === -1) {
								// index b has not been indexed yet
								if (inDistance(Math.abs(a-b))) {
									// the character is within distnace
									tempMatchedIndexes.push(b);
									matches.push(topString[a]);
									return true;
								} else {
									return false;
								}
							} else {
								//ALREADY BEEN INDEXED	
							}
						}	
					}
					return false;
					}());
				if (!matchFound) {
					tempMatchedIndexes.push("-");
				}	
			}
			return matches;
		
		}
		matchedIndexes = getMatching(string1, string2);
		matchedIndexes2 = getMatching(string2, string1);
		numberMatched = matchedIndexes.length;
		
		for (var a = 0; a < numberMatched; a++) {
			if (matchedIndexes[a] !== matchedIndexes2[a]) {
				halfTranspositions++;
			}	
		}
		
		transpositions = halfTranspositions/2;
		jd = ((numberMatched/l1) + (numberMatched/l2) + ((numberMatched-transpositions)/numberMatched))/3;
		return jd;
	};
	
	var jwDistance = function(string1,string2, leadingCharactersToScore, scorePerMatch) {
		// Returns Jaro-Winkler Distance
		leadingCharactersToScore = leadingCharactersToScore || 2;
		scorePerMatch = scorePerMatch || .1; // should not be greater than .25
		var jd = jaroDistance(string1,string2);
		var jw = jd+((leadingCharactersToScore*scorePerMatch)*(1-jd));
		return jw;	
	}
	
	var lsDistance = function(pattern, text) {
		//  Returns Levenshtein Distance
		var i = 0,
			i2 = 0,
			matrix = [], // text.length by pattern.length matrix
			width = text.length, // n
			height = pattern.length; // m
		
		var blankArray = function(length) {
			var temp = [];
			for (var a = 0; a < length; a++) {
				temp[a] = 0;	
			}
			return temp;
		}
			
		for (i = 0; i <= width; i++) {
			matrix[i] = blankArray(height+1);
			matrix[i][0] = i;
		}
		
		for (i = 0; i <= height; i++) {
			matrix[0][i] = i;	
		}
		
		for (i = 1; i <= height; i++) {
			for (i2 = 1; i2 <= width; i2++) {
				if (pattern[i-1] === text[i2-1]) {
					matrix[i2][i] = matrix[i2-1][i-1];	
				} else {
					var deletion = matrix[i2-1][i] + 1;
					var insertion = matrix[i2][i-1] + 1;
					var substitution = matrix[i2-1][i-1] + 1;
					matrix[i2][i] = Math.min(deletion, insertion, substitution);									
				}
			}
		}
		return matrix[width][height];
	};
	
	return {
		lsDistance:lsDistance,
		jwDistance:jwDistance,
		jaroDistance:jaroDistance	
	};
}());
