/**
 * PlacementAI — Typed Input/Output Starter Code Template Engine
 * Generates compile-ready, tested starter code boilerplate with robust standard input (stdin)
 * reading across Python, Java, C++, and JavaScript from a typed specification.
 */

export const CodeTemplateEngine = {
  /**
   * Generates starter code for all 4 languages from a typed I/O specification.
   * @param {Object} spec - { inputType, outputType, variables, returnInstruction }
   * @returns {Object} { python, java, cpp, javascript }
   */
  generateStarterCode(spec) {
    return {
      python: this.generatePython(spec),
      java: this.generateJava(spec),
      cpp: this.generateCpp(spec),
      javascript: this.generateJavascript(spec)
    };
  },

  generatePython(spec) {
    const { inputType, variables = {}, returnInstruction = 'Write your logic here' } = spec;

    if (inputType === 'array_and_target') {
      const arr = variables.arrayVar || 'nums';
      const target = variables.targetVar || 'target';
      return `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    ${arr} = [int(x) for x in tokens[1:n+1]]
    ${target} = int(tokens[n+1])
    
    # ${returnInstruction}
    pass

if __name__ == '__main__':
    solve()
`;
    }

    if (inputType === 'array_1d') {
      const arr = variables.arrayVar || 'nums';
      return `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    ${arr} = [int(x) for x in tokens[1:n+1]]
    
    # ${returnInstruction}
    pass

if __name__ == '__main__':
    solve()
`;
    }

    if (inputType === 'two_arrays') {
      const a1 = variables.arr1Var || 'nums1';
      const a2 = variables.arr2Var || 'nums2';
      return `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    m = int(tokens[0])
    n = int(tokens[1])
    ${a1} = [int(x) for x in tokens[2:2+m]]
    ${a2} = [int(x) for x in tokens[2+m:2+m+n]]
    
    # ${returnInstruction}
    pass

if __name__ == '__main__':
    solve()
`;
    }

    if (inputType === 'string_single') {
      const strVar = variables.strVar || 's';
      return `import sys

def solve():
    ${strVar} = sys.stdin.read().rstrip('\\r\\n')
    if not ${strVar}:
        return
        
    # ${returnInstruction}
    pass

if __name__ == '__main__':
    solve()
`;
    }

    if (inputType === 'two_strings') {
      const s1 = variables.str1Var || 's';
      const s2 = variables.str2Var || 't';
      return `import sys

def solve():
    tokens = sys.stdin.read().split()
    if len(tokens) < 2:
        return
    ${s1} = tokens[0]
    ${s2} = tokens[1]
    
    # ${returnInstruction}
    pass

if __name__ == '__main__':
    solve()
`;
    }

    if (inputType === 'matrix_2d') {
      const mat = variables.matrixVar || 'matrix';
      return `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    m = int(tokens[0])
    n = int(tokens[1])
    ${mat} = []
    idx = 2
    for _ in range(m):
        ${mat}.append([int(x) for x in tokens[idx:idx+n]])
        idx += n
        
    # ${returnInstruction}
    pass

if __name__ == '__main__':
    solve()
`;
    }

    if (inputType === 'single_int') {
      const varName = variables.varName || 'n';
      return `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    ${varName} = int(tokens[0])
    
    # ${returnInstruction}
    pass

if __name__ == '__main__':
    solve()
`;
    }

    // Default generic fallback
    return `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
        
    # ${returnInstruction}
    pass

if __name__ == '__main__':
    solve()
`;
  },

  generateJava(spec) {
    const { inputType, variables = {}, returnInstruction = 'Write your logic here' } = spec;

    if (inputType === 'array_and_target') {
      const arr = variables.arrayVar || 'nums';
      const target = variables.targetVar || 'target';
      return `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = null;
        List<String> tokens = new ArrayList<>();
        String line;
        while ((line = br.readLine()) != null) {
            st = new StringTokenizer(line);
            while (st.hasMoreTokens()) tokens.add(st.nextToken());
        }
        if (tokens.isEmpty()) return;

        int n = Integer.parseInt(tokens.get(0));
        int[] ${arr} = new int[n];
        for (int i = 0; i < n; i++) ${arr}[i] = Integer.parseInt(tokens.get(i + 1));
        int ${target} = Integer.parseInt(tokens.get(n + 1));

        // ${returnInstruction}
    }
}
`;
    }

    if (inputType === 'array_1d') {
      const arr = variables.arrayVar || 'nums';
      return `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = null;
        List<String> tokens = new ArrayList<>();
        String line;
        while ((line = br.readLine()) != null) {
            st = new StringTokenizer(line);
            while (st.hasMoreTokens()) tokens.add(st.nextToken());
        }
        if (tokens.isEmpty()) return;

        int n = Integer.parseInt(tokens.get(0));
        int[] ${arr} = new int[n];
        for (int i = 0; i < n; i++) ${arr}[i] = Integer.parseInt(tokens.get(i + 1));

        // ${returnInstruction}
    }
}
`;
    }

    if (inputType === 'two_arrays') {
      const a1 = variables.arr1Var || 'nums1';
      const a2 = variables.arr2Var || 'nums2';
      return `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = null;
        List<String> tokens = new ArrayList<>();
        String line;
        while ((line = br.readLine()) != null) {
            st = new StringTokenizer(line);
            while (st.hasMoreTokens()) tokens.add(st.nextToken());
        }
        if (tokens.isEmpty()) return;

        int m = Integer.parseInt(tokens.get(0));
        int n = Integer.parseInt(tokens.get(1));
        int[] ${a1} = new int[m];
        for (int i = 0; i < m; i++) ${a1}[i] = Integer.parseInt(tokens.get(2 + i));
        int[] ${a2} = new int[n];
        for (int i = 0; i < n; i++) ${a2}[i] = Integer.parseInt(tokens.get(2 + m + i));

        // ${returnInstruction}
    }
}
`;
    }

    if (inputType === 'string_single') {
      const strVar = variables.strVar || 's';
      return `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String ${strVar} = br.readLine();
        if (${strVar} == null) ${strVar} = "";

        // ${returnInstruction}
    }
}
`;
    }

    if (inputType === 'two_strings') {
      const s1 = variables.str1Var || 's';
      const s2 = variables.str2Var || 't';
      return `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String ${s1} = sc.next();
        if (!sc.hasNext()) return;
        String ${s2} = sc.next();

        // ${returnInstruction}
    }
}
`;
    }

    return `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner sc = new Scanner(System.in);
        // ${returnInstruction}
    }
}
`;
  },

  generateCpp(spec) {
    const { inputType, variables = {}, returnInstruction = 'Write your logic here' } = spec;

    if (inputType === 'array_and_target') {
      const arr = variables.arrayVar || 'nums';
      const target = variables.targetVar || 'target';
      return `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> ${arr}(n);
    for (int i = 0; i < n; i++) cin >> ${arr}[i];
    int ${target};
    cin >> ${target};

    // ${returnInstruction}

    return 0;
}
`;
    }

    if (inputType === 'array_1d') {
      const arr = variables.arrayVar || 'nums';
      return `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> ${arr}(n);
    for (int i = 0; i < n; i++) cin >> ${arr}[i];

    // ${returnInstruction}

    return 0;
}
`;
    }

    if (inputType === 'two_arrays') {
      const a1 = variables.arr1Var || 'nums1';
      const a2 = variables.arr2Var || 'nums2';
      return `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int m, n;
    if (!(cin >> m >> n)) return 0;
    vector<int> ${a1}(m), ${a2}(n);
    for (int i = 0; i < m; i++) cin >> ${a1}[i];
    for (int i = 0; i < n; i++) cin >> ${a2}[i];

    // ${returnInstruction}

    return 0;
}
`;
    }

    if (inputType === 'string_single') {
      const strVar = variables.strVar || 's';
      return `#include <iostream>
#include <string>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string ${strVar};
    if (!getline(cin, ${strVar})) return 0;

    // ${returnInstruction}

    return 0;
}
`;
    }

    if (inputType === 'two_strings') {
      const s1 = variables.str1Var || 's';
      const s2 = variables.str2Var || 't';
      return `#include <iostream>
#include <string>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string ${s1}, ${s2};
    if (!(cin >> ${s1} >> ${s2})) return 0;

    // ${returnInstruction}

    return 0;
}
`;
    }

    return `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // ${returnInstruction}

    return 0;
}
`;
  },

  generateJavascript(spec) {
    const { inputType, variables = {}, returnInstruction = 'Write your logic here' } = spec;

    if (inputType === 'array_and_target') {
      const arr = variables.arrayVar || 'nums';
      const target = variables.targetVar || 'target';
      return `const fs = require('fs');

function solve() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 3 || tokens[0] === '') return;

    const n = parseInt(tokens[0], 10);
    const ${arr} = [];
    for (let i = 0; i < n; i++) {
        ${arr}.push(parseInt(tokens[i + 1], 10));
    }
    const ${target} = parseInt(tokens[n + 1], 10);

    // ${returnInstruction}
}

solve();
`;
    }

    if (inputType === 'array_1d') {
      const arr = variables.arrayVar || 'nums';
      return `const fs = require('fs');

function solve() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2 || tokens[0] === '') return;

    const n = parseInt(tokens[0], 10);
    const ${arr} = [];
    for (let i = 0; i < n; i++) {
        ${arr}.push(parseInt(tokens[i + 1], 10));
    }

    // ${returnInstruction}
}

solve();
`;
    }

    if (inputType === 'two_arrays') {
      const a1 = variables.arr1Var || 'nums1';
      const a2 = variables.arr2Var || 'nums2';
      return `const fs = require('fs');

function solve() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 3) return;

    const m = parseInt(tokens[0], 10);
    const n = parseInt(tokens[1], 10);
    const ${a1} = tokens.slice(2, 2 + m).map(Number);
    const ${a2} = tokens.slice(2 + m, 2 + m + n).map(Number);

    // ${returnInstruction}
}

solve();
`;
    }

    if (inputType === 'string_single') {
      const strVar = variables.strVar || 's';
      return `const fs = require('fs');

function solve() {
    const ${strVar} = fs.readFileSync(0, 'utf-8').replace(/\\r?\\n$/, '');
    if (!${strVar}) return;

    // ${returnInstruction}
}

solve();
`;
    }

    if (inputType === 'two_strings') {
      const s1 = variables.str1Var || 's';
      const s2 = variables.str2Var || 't';
      return `const fs = require('fs');

function solve() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;

    const ${s1} = tokens[0];
    const ${s2} = tokens[1];

    // ${returnInstruction}
}

solve();
`;
    }

    return `const fs = require('fs');

function solve() {
    // ${returnInstruction}
}

solve();
`;
  }
};

